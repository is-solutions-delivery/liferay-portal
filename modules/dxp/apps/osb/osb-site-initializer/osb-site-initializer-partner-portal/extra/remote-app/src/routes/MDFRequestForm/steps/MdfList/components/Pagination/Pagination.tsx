import {ClayPaginationWithBasicItems} from '@clayui/pagination'
import { useState } from 'react';

type Props = {
    listObj?: any //in the future change to an array of the object
    
}
const Pagination = ({ listObj, ...props }: Props) => {
    const [active, setActive] = useState(1);

    return (
    <div {...props}>
      <ClayPaginationWithBasicItems
        active={active}
        ellipsisBuffer={1}
        onActiveChange={setActive}
        totalPages={25} 
      />
        </div>
    )

}
export default Pagination