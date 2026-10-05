import { ActivitiesTableRow } from "./ActivitiesTableRow.jsx"

export function ActivitiesTable({ activities }) {
    return <table border="1" className="activities-table">
        <thead>
            <tr>
                <th>Activity</th>
                <th>Time</th>
                <th>Points</th>
            </tr>
        </thead>
        <tbody>
            {activities.map(activity =>
                <ActivitiesTableRow key={activity.at} activity={activity} />)}
        </tbody>
    </table>
}
