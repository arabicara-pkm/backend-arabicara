import { Router } from 'express';
import * as WebhookController from '../controllers/webhook.controller';

const router = Router();

// Endpoint ini akan dipanggil oleh Google Cloud Storage
// URL lengkapnya akan menjadi: https://.../api/v1/webhooks/gcs-tts-complete/[KUNCI_RAHASIA]
router.post(
    `/gcs-tts-complete/${process.env.WEBHOOK_SECRET_KEY}`,
    WebhookController.handleGcsNotification
);

export default router;