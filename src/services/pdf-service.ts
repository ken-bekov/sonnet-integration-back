import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

interface PDFOptions {
    title: string;
    content: string;
    fileName: string;
}
const PDF_UPLOAD_PATH = path.join(__dirname, 'uploads');

export async function generatePDF({ title, content, fileName }: PDFOptions): Promise<string> {
    return new Promise((resolve, reject) => {                
        if (!fs.existsSync(PDF_UPLOAD_PATH)) {
            fs.mkdirSync(PDF_UPLOAD_PATH);
        }

        const filePath = path.join(PDF_UPLOAD_PATH, fileName);

        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(filePath);
        const fontPath = path.join(__dirname, '/fonts/Roboto-Regular.ttf');

        doc.pipe(writeStream);

        doc.info.Title = title;
        doc.info.Author = 'AI Model';

        doc.font(fontPath).fontSize(12).text(content, {
            align: 'left',
        });

        doc.end();

        writeStream.on('finish', () => {
            resolve(filePath);
        });

        writeStream.on('error', (err) => {
            reject(err);
        });
    });
}

export async function downloadPDF(req: Request, res: Response): void {
    const { fileName } = req.params;
    const filePath = path.join(PDF_UPLOAD_PATH, fileName);
  
    if (fs.existsSync(filePath)) {
        res.download(filePath, (err) => {
            if (err) {
                res.status(500).send('Ошибка при скачивании файла');
            }
        });
    } else {
        res.status(404).send('Файл не найден');
    }
}