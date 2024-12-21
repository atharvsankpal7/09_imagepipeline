from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cloudinary
import cloudinary.uploader
import os
import base64
import aiosqlite
from datetime import datetime
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)


# Define request model
class ImageUploadRequest(BaseModel):
    original_image: str
    mask_image: str


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def init_db():
    async with aiosqlite.connect("images.db") as db:
        await db.execute(
            """
            CREATE TABLE IF NOT EXISTS images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                original_url TEXT NOT NULL,
                mask_url TEXT NOT NULL,
                cloudinary_original_id TEXT NOT NULL,
                cloudinary_mask_id TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """
        )
        await db.commit()


@app.on_event("startup")
async def startup_event():
    await init_db()


@app.post("/upload")
async def upload_images(request: ImageUploadRequest):
    try:
        # Create data URIs for Cloudinary
        original_data_uri = f"data:image/png;base64,{request.original_image}"
        mask_data_uri = f"data:image/png;base64,{request.mask_image}"

        # Upload original image to Cloudinary
        original_result = cloudinary.uploader.upload(
            original_data_uri, folder="inpainting/originals"
        )

        # Upload mask image to Cloudinary
        mask_result = cloudinary.uploader.upload(
            mask_data_uri, folder="inpainting/masks"
        )

        # Save to database
        async with aiosqlite.connect("images.db") as db:
            await db.execute(
                """
                INSERT INTO images (original_url, mask_url, cloudinary_original_id, cloudinary_mask_id)
                VALUES (?, ?, ?, ?)
            """,
                (
                    original_result["secure_url"],
                    mask_result["secure_url"],
                    original_result["public_id"],
                    mask_result["public_id"],
                ),
            )
            await db.commit()

        return {
            "original_url": original_result["secure_url"],
            "mask_url": mask_result["secure_url"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/images")
async def get_images():
    async with aiosqlite.connect("images.db") as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            """
            SELECT id, original_url, mask_url, created_at
            FROM images
            ORDER BY created_at DESC
        """
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]


@app.delete("/images/{image_id}")
async def delete_image(image_id: int):
    try:
        async with aiosqlite.connect("images.db") as db:
            # Get Cloudinary IDs
            cursor = await db.execute(
                """
                SELECT cloudinary_original_id, cloudinary_mask_id
                FROM images WHERE id = ?
            """,
                (image_id,),
            )
            row = await cursor.fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Image not found")

            # Delete from Cloudinary
            cloudinary.uploader.destroy(row[0])
            cloudinary.uploader.destroy(row[1])

            # Delete from database
            await db.execute("DELETE FROM images WHERE id = ?", (image_id,))
            await db.commit()

        return {"message": "Image deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
