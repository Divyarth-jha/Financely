import React from 'react'
import "./card.css"
import {Row,Card} from 'antd'
import Button from '../button/button'
function Cards  ({showExpenseModal,showIncomeModal,income,expense,totalBalance})  {
  return (
    <div>
      <Row className='my-row'>
       <Card className="my-card"
       >
        <h2>Current Balance</h2>
        <p className='my-p'>{totalBalance}</p>
        <Button text="Reset Balance" blue={true}></Button>

       </Card>

       <Card className="my-card">
         <h2>Total Income</h2>
        <p className='my-p'>{income}</p>
        <Button text="Add Income" blue={true} onClick={showIncomeModal} ></Button >

       </Card>
       <Card className="my-card">
         <h2>Total Expence</h2>
        <p className='my-p'>{expense}</p>
        <Button text="Add Expence" blue={true} onClick={showExpenseModal}></Button>

       </Card>
      </Row>
    </div>
  );
}

export default Cards
