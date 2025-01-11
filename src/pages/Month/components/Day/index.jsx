import classNames from 'classnames'
import './index.scss'
import { useMemo, useState } from 'react'

const DailyBill = ({ date, billList }) => {
    const [visible, setVisible] = useState(false)
    const dayResult = useMemo(() => {
        const calculateTotal = (type) =>
            billList
                .filter((item) => item.type === type)
                .reduce((total, item) => total + item.money, 0);

        const pay = calculateTotal('pay')
        const income = calculateTotal('income')

        return {
            pay,
            income,
            total: pay + income,
        };
    }, [billList])

    return (
        <div className={classNames('dailyBill')}>
            <div className="header">
                <div className="dateIcon">
                    <span className="date">{'03月23日'}</span>
                    <span className={classNames('arrow')} onClick={() => setVisible(!visible)}></span>
                </div>
                <div className="oneLineOverview">
                    <div className="pay">
                        <span className="type">支出</span>
                        <span className="money">{dayResult.pay}</span>
                    </div>
                    <div className="income">
                        <span className="type">收入</span>
                        <span className="money">{dayResult.income}</span>
                    </div>
                    <div className="balance">
                        <span className="money">{dayResult.total}</span>
                        <span className="type">结余</span>
                    </div>
                </div>

            </div>

            <div className="billList" style={{ display: visible ? 'block' : 'none' }}>
                {billList.map(item => {
                    return (
                        <div className="bill" key={item.id}>
                            <div className="detail">
                                <div className="billType">{item.useFor}</div>
                            </div>
                            <div className={classNames('money', item.type)}>
                                {item.money.toFixed(2)}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}
export default DailyBill