import ClayPanel from '@clayui/panel';

type Props = {
    activityObj: any;
}
const ListActivities = ({ activityObj }: Props) => {
    return (
        <>

            <div>
                {activityObj.activities.map((activity: any) => (
                    <ClayPanel
                        collapsable
                        displayTitle={activity.activityName}
                        displayType="secondary"
                        showCollapseIcon={true}

                    >

                        <ClayPanel.Body>{
                            <div>
                                <table className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th scope='col'>Campaign Activity</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>Activity Name</td>

                                            <td>{activity.activityName}</td>
                                        </tr>

                                        <tr>
                                            <td>Type of Activity</td>

                                            <td>{activity.typeActivity}</td>
                                        </tr>

                                        <tr>
                                            <td>Tactic</td>

                                            <td>{activity.tactic}</td>
                                        </tr>

                                        <tr>
                                            <td>Activity Description</td>

                                            <td>{activity.activityDesription}</td>
                                        </tr>

                                        <tr>
                                            <td>Venue Name</td>

                                            <td>{activity.venueName}</td>
                                        </tr>

                                        <tr>
                                            <td>Liferay Branding</td>

                                            <td>{activity.liferayBranding}</td>
                                        </tr>

                                        <tr>
                                            <td>Liferay Participation / Requirements</td>

                                            <td>{activity.liferayParticipationRequirements}</td>
                                        </tr>

                                        <tr>
                                            <td>Source and Size of Invite List</td>

                                            <td>{activity.sourceSizeInviteList}</td>
                                        </tr>

                                        <tr>
                                            <td>Activity Promotion</td>

                                            <td>{activity.activityPromotion}</td>
                                        </tr>

                                        <tr>
                                            <td>Start Date</td>

                                            <td>{activity.starDate}</td>
                                        </tr>

                                        <tr>
                                            <td>End Date</td>

                                            <td>{activity.endDate}</td>
                                        </tr>
                                    </tbody>
                                </table>


                                <hr></hr>
                                <table className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th scope='col'>Budget Breakdown</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activity.addExpenses.map((expenses:any)  => (
                                             <tr>
                                                <td>{expenses.expense}</td>
                                                <td>{expenses.budget}</td>
                                             </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <hr></hr>

                                <table className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th scope='col'>Lead List</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Is a lead list an outcome of this activity?</td>
                                            <td>Yes</td>
                                        </tr>
                                        <tr>
                                            <td>Target # of Leads</td>
                                            <td>1,000</td>
                                        </tr>
                                        <tr>
                                            <td>Lead Follow Up strategy</td>
                                            <td>Social Campaign</td>
                                        </tr>
                                        <tr>
                                            <td>Details on Lead Follow Up</td>
                                            <td>()</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        }</ClayPanel.Body>
                    </ClayPanel>
                            ))}
                            </div>

        </>
    );
};
export default ListActivities;

function expenses(expenses: any): import("react").ReactNode {
    throw new Error('Function not implemented.');
}
