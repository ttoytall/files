import { ethers } from "ethers";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { wallet, challenge, nonce } = req.body;
  const difficulty = 5;

  // 1. Проверяем PoW (SHA-256)
  const data = challenge + wallet.toLowerCase() + nonce;
  const hash = crypto.createHash('sha256').update(data).digest('hex');

  if (!hash.startsWith("0".repeat(difficulty))) {
    return res.status(403).json({ error: "Invalid Proof of Work" });
  }

  const privateKey = process.env.OWNER_PRIVATE_KEY; 
  const walletSigner = new ethers.Wallet(privateKey);

  const sigNonce = Math.floor(Date.now() / 1000); 
  

  const messageHash = ethers.solidityPackedKeccak256(
    ["address", "uint256"],
    [wallet, sigNonce]
  );
  
  const signature = await walletSigner.signMessage(ethers.toBeArray(messageHash));

  res.status(200).json({
    signature: signature,
    sigNonce: sigNonce
  });
}
