import React from 'react';
import { Line, Pie } from '@ant-design/charts';

function Chart({ shortedTransactions = [] }) {
  const data = shortedTransactions.map(item => ({
    date: item.date,
    amount: item.amount,
  }));

  const pieData = shortedTransactions
    .filter(transaction => transaction.type === "expense")
    .map(transaction => ({
      tag: transaction.tag,
      amount: transaction.amount,
    }));

    let newSpendings = [
{ tag: "food", amount: 0 },
{ tag: "education", amount: 0 },
{ tag: "office", amount: 0 },]
pieData.forEach((item) =>{
if (item.tag == "food") {
newSpendings[0].amount += item.amount;
} else if (item.tag == "education") {
newSpendings[1].amount += item.amount;
} else {
newSpendings[2].amount += item.amount;
}
});

  const lineConfig = {
    data,
    xField: 'date',
    yField: 'amount',
    autoFit: true,
    height: 400,
    smooth: true,
    lineStyle: {
      stroke: '#1890ff',
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 4,
      lineWidth: 3,
    },
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: '#1890ff',
        stroke: '#fff',
        lineWidth: 2,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowBlur: 6,
      },
    },
    xAxis: { label: { style: { fontWeight: 600, fontSize: 13 } } },
    yAxis: { label: { style: { fontWeight: 600, fontSize: 13 } } },
    tooltip: { showMarkers: true, shared: true },
    area: { style: { fill: 'l(270) 0:#1890ff33 1:#ffffff00' } },
  };

  const pieConfig = {
    data: newSpendings,
    autoFit: true,
    angleField: 'amount',
    colorField: 'tag',
    radius: 0.8,
   label: {
 
  content: (data) => `${data.tag}: ${(data.percent * 100).toFixed(1)}%`,
  style: {
    fontSize: 12,
    fontWeight: 600,
  },
},

    interactions: [{ type: 'element-active' }],
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        padding: '20px',
        margin: '20px ',
        width: 'auto',
        // maxWidth: '1200px',
        // minWidth: '500px',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: '18px',
          marginBottom: '20px',
          color: '#333',
          textShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        Transaction Overview
      </h2>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '400px' }}>
          <Line {...lineConfig} />
        </div>
        <div style={{ flex: 1, minWidth: '400px' }}>
          <h2
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: '18px',
              marginBottom: '10px',
              color: '#333',
            }}
          >
            Your Spendings Breakdown
          </h2>
          <Pie {...pieConfig} />
        </div>
      </div>
    </div>
  );
}

export default Chart;
