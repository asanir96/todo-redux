const { useState, Fragment } = React
const { Link } = ReactRouterDOM

export function ActivitiesTableRow({ activity }) {

    return <Fragment>
        <tr>
            <td>{activity.txt}</td>
            <td >{new Date(activity.at).toLocaleString()}</td>
            <td>{activity.txt === 'Completed a task' ? '10' : ''}</td>
        </tr>
    </Fragment>
}
