import { ethers } from "ethers";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const { wallet, challenge, nonce } = req.body;

  // 1. Проверка PoW (SHA-256)
  const data = challenge + wallet.toLowerCase() + nonce;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  if (!hash.startsWith("00000")) return res.status(403).json({ error: "Invalid PoW" });

  const privateKey = process.env.OWNER_PRIVATE_KEY;
  const walletSigner = new ethers.Wallet(privateKey);

  // 2. Создаем уникальный sigNonce (таймстемп)
  const sigNonce = Math.floor(Date.now() / 1000);

  // 3. Хэшируем данные точно так же, как в твоем новом контракте (abi.encodePacked)
  const messageHash = ethers.solidityPackedKeccak256(
    ["address", "uint256"],
    [wallet, sigNonce]
  );

  // 4. Подписываем хэш
  const signature = await walletSigner.signMessage(ethers.toBeArray(messageHash));

  res.status(200).json({ signature, sigNonce });
}
