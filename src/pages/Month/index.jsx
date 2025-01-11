import { NavBar, DatePicker } from 'antd-mobile'
import './index.scss'
import { useState, useMemo, useEffect } from 'react'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import DailyBill from './components/Day/index'

const Month = () => {
    const [dateVisible, setDateVisible] = useState(false)

    const [currentDate, setCurrentDate] = useState(() => {
        return dayjs(new Date()).format('YYYY-MM')
    })

    const billList = useSelector(state => state.bill.billList)
    const monthGroup = useMemo(() => {
        return _.groupBy(billList, (item) => dayjs(item.date).format('YYYY-MM'));
    }, [billList])

    const [monthList, setMonthList] = useState([])
    const onConfirm = (date) => {
        setDateVisible(false)
        const formatDate = dayjs(date).format('YYYY-MM')
        setCurrentDate(formatDate);

        if (!monthGroup[formatDate]) {
            setMonthList([])
            return
        }

        setMonthList(monthGroup[formatDate])
    };

    const monthResult = useMemo(() => {
        const calculateTotal = (type) =>
            monthList
                .filter((item) => item.type === type)
                .reduce((total, item) => total + item.money, 0);

        const pay = calculateTotal('pay')
        const income = calculateTotal('income')

        return {
            pay,
            income,
            total: pay + income,
        };
    }, [monthList])

    useEffect(() => {
        const nowDate = dayjs().format('YYYY-MM');
        setMonthList(monthGroup[nowDate] || []);
    }, [monthGroup]);

    const dayGroup = useMemo(() => {
        const groupData = _.groupBy(monthList, (item) => dayjs(item.date).format('YYYY-MM-DD'))
        const keys = Object.keys(groupData)
        return {
            groupData,
            keys,
        }
    }, [monthList])

    return (
        <div className="monthlyBill">
            <NavBar className="nav" backArrow={false}>
                月度收支
            </NavBar>
            <div className="content">
                <div className="header">
                    <div className="date" onClick={() => setDateVisible(true)}>
                        <span className="text">
                            {currentDate + ' '}月账单
                        </span>
                        <span className={classNames('arrow', dateVisible && 'expand')}></span>
                    </div>

                    <div className='twoLineOverview'>
                        <div className="item">
                            <span className="money">{monthResult.pay.toFixed(2)}</span>
                            <span className="type">支出</span>
                        </div>
                        <div className="item">
                            <span className="money">{monthResult.income.toFixed(2)}</span>
                            <span className="type">收入</span>
                        </div>
                        <div className="item">
                            <span className="money">{monthResult.total.toFixed(2)}</span>
                            <span className="type">结余</span>
                        </div>
                    </div>

                    <DatePicker
                        className="kaDate"
                        title="记账日期"
                        precision="month"
                        visible={dateVisible}
                        onCancel={() => setDateVisible(false)}
                        onConfirm={onConfirm}
                        onClose={() => setDateVisible(false)}
                        max={new Date()}
                    />
                </div>
                {
                    dayGroup.keys.map(key => {
                        return <DailyBill key={key} date={key} billList={dayGroup.groupData[key]} />
                    })
                }
            </div>
        </div >
    )
}

export default Month