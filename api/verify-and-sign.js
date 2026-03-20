import { ethers } from "ethers";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const { wallet, challenge, nonce } = req.body;


  const data = challenge + wallet.toLowerCase() + nonce;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  if (!hash.startsWith("00000")) return res.status(403).json({ error: "Invalid PoW" });

  const privateKey = process.env.OWNER_PRIVATE_KEY;
  if (!privateKey) return res.status(500).json({ error: "Private key not set" });
  
  const walletSigner = new ethers.Wallet(privateKey);


  const sigNonce = Math.floor(Date.now() / 1000);


  const messageHash = ethers.solidityPackedKeccak256(
    ["address", "uint256"],
    [ethers.getAddress(wallet), sigNonce] 
  );


  const signature = await walletSigner.signMessage(ethers.getBytes(messageHash));

  res.status(200).json({ signature, sigNonce });
}
