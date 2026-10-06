import { ActivitiesTableRow } from "./ActivitiesTableRow.jsx"

export function ActivitiesTable({ activities, bgColor }) {
    if (!activities) return <div>Loading...</div>

    return <section className="user-activities">
        <h3>User Activities</h3>

        {activities.length ?
            <table border="1" className="activities-table">
                <thead>
                    <tr style={{ backgroundColor: bgColor || '#009879' }}>
                        <th>Activity</th>
                        <th>Time</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map(activity =>
                        <ActivitiesTableRow key={activity.at} activity={activity} />)}
                </tbody>
            </table> :
            <div>No activities yet..</div>}
    </section>

}
