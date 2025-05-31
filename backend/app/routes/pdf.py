from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
import fitz
import os
import pytesseract
from PIL import Image
import io

router = APIRouter()

# if the pdf has some text, the preference will be to scan it completely as text
# this doesn't cover the cases when pdf has text and images of a text
# we remain with this design choice for simplicity for now
@router.post("/upload_pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        return JSONResponse(status_code=400, content={"error": "Only PDF files are allowed"})

    save_path = f"uploaded/{file.filename}"
    with open(save_path, "wb") as f:
        f.write(await file.read())

    try:
        doc = fitz.open(save_path)
        has_text = any(page.get_text().strip() for page in doc)

        pdf_type = "text-based" if has_text else "image-based"
        text = analyze_text_pdf(doc) if has_text else analyze_image_pdf(doc)

        # save it as a plaintext file
        with open(f"uploaded/{file.filename.replace("pdf", "txt")}", "w") as f:
            f.write(text)

        return {"filename": file.filename, "type": pdf_type, "text": text}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Failed to analyze PDF: {str(e)}"})
    finally:
        doc.close()
        os.remove(save_path)

@router.get("/download_text/{filename}")
async def download_text(filename: str):
    filename = filename.replace("pdf", "txt")
    if not filename.endswith(".txt"):
        filename += ".txt"

    file_path = f"uploaded/{filename}"

    if not os.path.isfile(file_path):
        return JSONResponse(status_code=400, content={"error": "File not found"})

    # return FileResponse(file_path, media_type="text/plain") this doesn't force the download
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )


def analyze_text_pdf(doc):
    text = ""

    for page in doc:
        text += page.get_text()

    # do corrections with strip()
    return text.strip()

def analyze_image_pdf(doc):
    text = ""

    for i, page in enumerate(doc):
        pix = page.get_pixmap()

        image = Image.open(io.BytesIO(pix.tobytes("png")))

        # run OCR on the image
        t = pytesseract.image_to_string(image, lang="eng")
        text += t

    return text.strip()