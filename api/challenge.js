export default function handler(req, res) {
  const { wallet } = req.query;
  if (!wallet) return res.status(400).json({ error: "Wallet required" });


  const challenge = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  res.status(200).json({
    challenge: challenge,
    difficulty: 5, 
    expiresIn: 300
  });
}
