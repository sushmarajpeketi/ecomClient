import React from 'react'
import DraftsIcon from "@mui/icons-material/Drafts";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SignalWifiConnectedNoInternet1TwoToneIcon from '@mui/icons-material/SignalWifiConnectedNoInternet1TwoTone';
import SnippetFolderIcon from '@mui/icons-material/SnippetFolder';

let icons  = {
    dashboard : <DraftsIcon/>,
    users:<GroupOutlinedIcon/>,
    products:<LocalGroceryStoreIcon/>,
    categories:<CategoryOutlinedIcon/>,
    roles:<PersonOutlineOutlinedIcon/>,
    fallBackIcon:<SignalWifiConnectedNoInternet1TwoToneIcon/>,
    module:<SnippetFolderIcon/>,

}
export default icons