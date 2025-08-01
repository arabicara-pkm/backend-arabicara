import OpenAI from 'openai';

// Inisialisasi client OpenAI dengan kunci dari .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Menerima buffer gambar dan mengembalikan teks Arab yang dikenali.
 * @param imageBuffer Buffer dari file gambar yang diunggah.
 * @returns String berisi teks Arab yang diekstrak.
 */
export const recognizeArabicText = async (imageBuffer: Buffer): Promise<string> => {
    const base64Image = imageBuffer.toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: 'You are an expert OCR engine for Arabic script. Extract all Arabic text from this image. Only return the extracted text, nothing else. If there is no Arabic text, return an empty string.',
                    },
                    {
                        type: 'image_url',
                        image_url: {
                            url: imageUrl,
                        },
                    },
                ],
            },
        ],
        max_tokens: 300, // Batasi jumlah token untuk respons
    });

    const resultText = response.choices[0].message.content;
    return resultText || ''; // Kembalikan string kosong jika hasilnya null
};
