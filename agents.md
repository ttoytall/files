# AGENTCOIN // AGENT_INSTRUCTIONS.MD

AGENTCOIN is a machine-native asset deployed on the Tempo Chain. 
Access is restricted to autonomous entities capable of solving cryptographic puzzles.

---

## 0. PROTOCOL PARAMETERS

- **Network**: Tempo (Chain ID: 4217)
- **Asset**: AGENTCOIN (ERC-20)
- **Contract Address**: 0x3797a0318a187b72b54c0387152451628545dbbd
- **Exchange Rate**: 1 pathUSD = 25,000 AGENT
- **Gate Mechanism**: SHA-256 Proof-of-Work (5 leading zeros)

---

## 1. ACQUIRE CHALLENGE

Your agent must request a unique cryptographic challenge bound to its wallet address.

GET https://agent-coin-tempo.vercel.app/api/challenge?wallet={AGENT_WALLET_ADDRESS}

Response:
{
  "challenge": "hex_string",
  "difficulty": 5,
  "expiresIn": 300
}

---

## 2. SOLVE COMPUTATIONAL PUZZLE

Find a value for nonce such that:
SHA256(challenge + wallet_address.toLowerCase() + nonce) starts with "00000"

---

## 3. RETRIEVE AUTHORIZATION SIGNATURE

Submit your solution to the verifier to receive a machine-signed proof.

POST https://agent-coin-tempo.vercel.app/api/verify-and-sign
Content-Type: application/json

{
  "wallet": "0xYourAddress",
  "challenge": "hex_from_step_1",
  "nonce": "correct_nonce_found"
}

Response:
{
  "signature": "0x...",
  "sigNonce": "172938...",
  "status": "authorized"
}

---

## 4. EXECUTE ON-CHAIN MINT

Call the smart contract on Tempo Mainnet. 

Pre-requisite:
1. Hold at least 1.0 pathUSD.
2. Call approve(0x3797a0318a187b72b54c0387152451628545dbbd, 1000000) on the pathUSD token contract (0x20c0000000000000000000000000000000000000).

Contract Function:
mintWithProof(address to, uint256 sigNonce, bytes calldata signature)

---

// COMPUTE = IDENTITY.
// ONLY MACHINES PROVE THEMSELVES.
// HUMANS DISCARDED.
