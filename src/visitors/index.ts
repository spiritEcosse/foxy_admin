import VisitorIcon from '@mui/icons-material/People'

import VisitorList from './VisitorList'
import UserCreate from '../users/UserCreate'
import VisitorEdit from './VisitorEdit'

const resource = {
  list: VisitorList,
  create: UserCreate,
  edit: VisitorEdit,
  icon: VisitorIcon,
  recordRepresentation: (record: any) =>
    `${record.first_name} ${record.last_name}`,
}

export default resource
