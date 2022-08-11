import ClayIcon from '@clayui/icon'; 
import DropDown from './Drop-Down'

const columns = [
    { label: 'Request ID', columnKey: 'requestId' },
    {
       label: 'Status',
       columnKey: 'status',
        render: (status:string) => (
            <div className="align-items-center">
                <ClayIcon symbol="simple-circle" />
                {status}
            </div>
        ),
    },
    { label: 'Activity Period', columnKey: 'activityPeriod' },
    { label: 'Total Cost', columnKey: 'totalCost' },
    { label: 'Requested', columnKey: 'requested' },
    { label: 'Approved', columnKey: 'approved' },

    {
        label: 'Reimpursement Claim(s)',
        columnKey: 'reimpursementClaim',
    },
    {
        label: '',
        columnKey: '',
        render: () => (
            <div>

                <ClayIcon symbol="comments" />

            </div>
        ),
    },
    {
        label: '',
        columnKey: '',
        render: () => (
            <div>

                <DropDown optionList={[
                    {
                        icon: "check",
                        label: "Approve",
                        optionKey: "approve",
                    },
                    {
                        icon: "times",
                        label: "Reject",
                        optionKey: 'reject'
                    }

                ]}></DropDown>

            </div>
        ),
    },

]

export default columns