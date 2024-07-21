import {CSSProperties, useMemo} from 'react'
import {useGetList} from 'react-admin'
import {Theme, useMediaQuery} from '@mui/material'
import {startOfDay, subDays} from 'date-fns'

import Welcome from './Welcome'
import MonthlyRevenue from './MonthlyRevenue'
import NbNewOrders from './NbNewOrders'
import PendingOrders from './PendingOrders'
import NewCustomers from './NewCustomers'

import {Order} from '../types'

interface OrderStats {
    revenue: number
    nbNewOrders: number
    pendingOrders: Order[]
}

interface State {
    nbNewOrders?: number
    pendingOrders?: Order[]
    recentOrders?: Order[]
    revenue?: string
}

const styles = {
    flex: {display: 'flex'},
    flexColumn: {display: 'flex', flexDirection: 'column'},
    leftCol: {flex: 1, marginRight: '0.5em'},
    rightCol: {flex: 1, marginLeft: '0.5em'},
    singleCol: {marginTop: '1em', marginBottom: '1em'},
}

const Spacer = () => <span style={{width: '1em'}}/>
const VerticalSpacer = () => <span style={{height: '1em'}}/>

const Dashboard = () => {
    const isXSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
    const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
    const aMonthAgo = useMemo(() => subDays(startOfDay(new Date()), 30), [])

    const {data: orders} = useGetList<Order>('commands', {
        filter: {date_gte: aMonthAgo.toISOString()},
        sort: {field: 'date', order: 'DESC'},
        pagination: {page: 1, perPage: 50},
    })

    const aggregation = useMemo<State>(() => {
        if (!orders) return {}
        const aggregations = orders
            .filter((order) => order.status !== 'Cancelled')
            .reduce(
                (stats: OrderStats, order) => {
                    if (order.status !== 'Cancelled') {
                        stats.revenue += order.total
                        stats.nbNewOrders++
                    }
                    if (order.status === 'Ordered') {
                        stats.pendingOrders.push(order)
                    }
                    return stats
                },
                {
                    revenue: 0,
                    nbNewOrders: 0,
                    pendingOrders: [],
                },
            )
        return {
            recentOrders: orders,
            revenue: aggregations.revenue.toLocaleString(undefined, {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }),
            nbNewOrders: aggregations.nbNewOrders,
            pendingOrders: aggregations.pendingOrders,
        }
    }, [orders])

    const {nbNewOrders, pendingOrders, revenue, recentOrders} = aggregation
    return isXSmall ? (
        <div>
            <div style={styles.flexColumn as CSSProperties}>
                <Welcome/>
                <MonthlyRevenue value={revenue}/>
                <VerticalSpacer/>
                <NbNewOrders value={nbNewOrders}/>
                <VerticalSpacer/>
                <PendingOrders orders={pendingOrders}/>
            </div>
        </div>
    ) : isSmall ? (
        <div style={styles.flexColumn as CSSProperties}>
            <div style={styles.singleCol}>
                <Welcome/>
            </div>
            <div style={styles.flex}>
                <MonthlyRevenue value={revenue}/>
                <Spacer/>
                <NbNewOrders value={nbNewOrders}/>
            </div>
            <div style={styles.singleCol}></div>
            <div style={styles.singleCol}>
                <PendingOrders orders={pendingOrders}/>
            </div>
        </div>
    ) : (
        <>
            <Welcome/>
            <div style={styles.flex}>
                <div style={styles.leftCol}>
                    <div style={styles.flex}>
                        <MonthlyRevenue value={revenue}/>
                        <Spacer/>
                        <NbNewOrders value={nbNewOrders}/>
                    </div>
                    <div style={styles.singleCol}></div>
                    <div style={styles.singleCol}>
                        <PendingOrders orders={pendingOrders}/>
                    </div>
                </div>
                <div style={styles.rightCol}>
                    <div style={styles.flex}>
                        <Spacer/>
                        <NewCustomers/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
