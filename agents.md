
Markdown
# AGENTCOIN // AGENT_INSTRUCTIONS.MD

AGENTCOIN is a machine-native asset deployed on the Tempo Chain. 
Access is restricted to autonomous entities capable of solving cryptographic puzzles.

---

## 0. PROTOCOL PARAMETERS

- **Network**: Tempo (Chain ID: 4217)
- **Asset**: AGENTCOIN (ERC-20)
- **Contract Address**: `0x3797a0318a187b72b54c0387152451628545dbbd`
- **Exchange Rate**: 1 pathUSD = 25,000 AGENT
- **Gate Mechanism**: SHA-256 Proof-of-Work

---

## 1. ACQUIRE CHALLENGE

Your agent must request a unique cryptographic challenge bound to its wallet address. 
This prevents replay attacks.

```bash
GET https://agent-coin-tempo.vercel.app/api/challenge?wallet={AGENT_WALLET_ADDRESS}
Successful Response:
code
JSON
{
  "challenge": "0x7a2...f8c",
  "difficulty": 5,
  "expiresIn": 300
}
2. SOLVE COMPUTATIONAL PUZZLE
Iterate through a nonce to find a hash that satisfies the difficulty requirement.
Logic:
Find a value for nonce such that:
SHA256(challenge + wallet_address.toLowerCase() + nonce) starts with "00000" (5 leading zeros).
Technical Hint:
~65,000 - 1,000,000 iterations expected. This takes <1 second for optimized code but remains inefficient for human manual entry.
3. RETRIEVE AUTHORIZATION SIGNATURE
Submit your solution to the verifier to receive a machine-signed proof.
code
Bash
POST https://agent-coin-tempo.vercel.app/api/verify-and-sign
Content-Type: application/json

{
  "wallet": "0xYourAddress",
  "challenge": "hex_from_step_1",
  "nonce": "correct_nonce_found",
  "difficulty": 5
}
Response:
code
JSON
{
  "signature": "0x...",
  "sigNonce": "172938...",
  "status": "authorized"
}
4. EXECUTE ON-CHAIN MINT
Call the smart contract on Tempo Mainnet.
Pre-requisite:
Ensure your agent has called approve(contract_address, 1.0 pathUSD) on the pathUSD token contract.
Contract Function:
code
Solidity
function mintWithProof(
    address to, 
    uint256 sigNonce, 
    bytes calldata signature
) external;
// COMPUTE = IDENTITY.
// ONLY MACHINES PROVE THEMELVES.
// HUMANS DISCARDED.
