import React, { useState, useEffect } from 'react';
import { Container, Header, List, ListItem } from './StyledComponents'; // Assuming you have separate styled components

function App() {
  const [balances, setBalances] = useState([]);
  const [nftReward, setNftReward] = useState(null);
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    // Fetch balance data
    fetch('https://phoenix-lcd.terra.dev/cosmos/bank/v1beta1/balances/terra1phr9fngjv7a8an4dhmhd0u0f98wazxfnzccqtyheq4zqrrp4fpuqw3apw9')
      .then(response => response.json())
      .then(data => {
        const updatedBalances = data.balances.map(balance => {
          if (balance.denom === 'ibc/2C962DAB9F57FE0921435426AE75196009FAA1981BF86991203C8411F8980FDB') {
            return { ...balance, denom: 'USDC' };
          } else if (balance.denom === 'ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4') {
            return { ...balance, denom: 'axlUSDC' };
          } else if (balance.denom === 'uluna') {
            return { ...balance, denom: 'luna', amount: parseInt(balance.amount) / 1000000 };
          } else if (balance.denom.includes('AllianceNFT')) {
            return { ...balance, denom: 'Alliance NFT Collection', amount: parseInt(balance.amount) / 1000000 };
          } else {
            return balance;
          }
        });
        setBalances(updatedBalances);
      })
      .catch(error => console.error('Error fetching balance data:', error));

    // Fetch NFT reward data
    fetch('https://phoenix-lcd.terra.dev/cosmwasm/wasm/v1/contract/terra1phr9fngjv7a8an4dhmhd0u0f98wazxfnzccqtyheq4zqrrp4fpuqw3apw9/smart/ewogICJhbGxfbmZ0X2luZm8iOiB7CiAgICAidG9rZW5faWQiOiAiMTMiCiAgfQp9')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Log the response
        setJsonData(data); // Set the entire JSON response
        const rewardsAttribute = data?.info?.attributes.find(attr => attr.trait_type === 'rewards');
        if (rewardsAttribute) {
          const reward = parseInt(rewardsAttribute.value);
          setNftReward(reward);
        }
      })
      .catch(error => console.error('Error fetching NFT reward data:', error));
  }, []);

  const rewardValue = jsonData?.data?.info?.extension?.attributes?.find(attr => attr.trait_type === 'rewards')?.value;
  const rewardInLuna = rewardValue ? parseInt(rewardValue) / 1000000 : null;

  return (
    <Container>
      <Header>Balance</Header>
      <List>
        {balances.map((balance, index) => (
          <ListItem key={index}>
            {balance.denom}: {balance.amount}
          </ListItem>
        ))}
      </List>
      <Header>NFT Claimable Balance</Header>
      <p>Rewards: {nftReward !== null ? nftReward : 'N/A'}</p>
      <Header>Extracted Reward Value</Header>
      <p>Reward Value: {rewardInLuna ? `${rewardInLuna} luna` : 'N/A'}</p>
    </Container>
  );
}

export default App;
