import React from 'react';
import Drawer from "@mui/material/Drawer";
import { Typography, styled, Checkbox, Button, IconButton } from '@mui/material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Search from '../../components/Search';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { deletethis, post } from '../../services/api-services';
const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    // border: `1px solid ${theme.palette.divider}`,
    // '&:not(:last-child)': {
    //     borderBottom: 0,
    // },
    // '&::before': {
    //     display: 'none',
    // },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
export default function ContentFilter(props) {
    const [expanded, setExpanded] = React.useState('panel1');

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };
    const handleChange = (panel) => (event, newExpanded) => {
        let temp = [...props?.assigedCourseIds]
        const index = temp.indexOf(panel);
        if (index > -1) {
            temp.splice(index, 1);
        }
        props?.setAssignesCourseIds(temp)
        setExpanded(newExpanded ? panel : false);
    };
    const submitFilter = async (event) => {
        try {
            setState({ ...state, ['right']: false });
            if (props?.assignedDel?.length > props?.assign?.length) {
                for (let index = 0; index < props?.assignedDel?.length; index++) {
                    const element = props?.assign[index];
                    const element1 = props?.assignedDel[index];
                    if (element1.id && element?.subjectId !== element1?.subjectId) {
                        await deletethis(`usersubjects/${element1?.id}`);
                    }
                }
            } else {
                for (let index = 0; index < props?.assign?.length; index++) {
                    const element = props?.assign[index];
                    const element1 = props?.assignedDel[index];
                    if (element1?.id && element?.subjectId !== element1?.subjectId) {
                        await deletethis(`usersubjects/${element1?.id}`);
                    }
                }
            }
            const promises = props.assign.map(element =>
                post(`usersubjects/upsertWithWhere?where={"userId": ${JSON.stringify(element.userId)}, "subjectId":${JSON.stringify(element.subjectId)}}`, element)
            );
            const results = await Promise.all(promises);
            props?.getSubjects();
        } catch (error) {
            console.error(error);
        }

    }
    const onSubjectAssign = (value) => {
        // Initialize temp based on whether there's a subjectId in the first assign object
        let temp = props?.assign[0]?.subjectId ? [...props.assign] : [];
        const __indexG = props?.selectedSubjects?.indexOf(value.id);
        let arrays = [...props?.selectedSubjects];

        if (__indexG >= 0) {
            // Subject ID exists in selectedSubjects, so remove it
            arrays.splice(__indexG, 1);
            // temp =temp.splice(__indexG, 1);
            const index = temp.findIndex((item) => item?.subjectId === value.id);
            temp.splice(index, 1);
            // temp = temp.map((item,index)=>{if(item?.subjectId===value.id){temp.splice(index, 1);} });
        } else {
            // Subject ID does not exist, so add it
            arrays.push(value.id);
            temp.push({ userId: props?.studentId, subjectId: value.id });
        }

        props?.setSelectedSubjects(arrays);
        props?.setAssign(temp);
    };

    return (
        <div>
            {["right"].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button
                        onClick={toggleDrawer(anchor, true)}
                        variant='contained'>
                        Assign Content
                    </Button>
                    <Drawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >

                        <div style={{ width: 400, overflowX: 'hidden' }} className='p-4 h-screen  flex flex-col justify-between  static'>
                            <div className='flex-1 overflow-y-auto'>
                                <div className='flex justify-between mb-4 items-center' >
                                    <Typography variant='h5'>Assign Content</Typography>
                                    <IconButton onClick={toggleDrawer(anchor, false)}>
                                        <CloseOutlinedIcon sx={{ fontSize: 30 }} />
                                    </IconButton>
                                </div>
                                <Search courseSearch={props?.courseSearch} name='course' />
                                {props?.allCourse?.map((data, index) => (
                                    <div className='flex flex-col gap-6' key={data?.id}>
                                        <Accordion expanded={expanded === `${data?.id}` || props?.assigedCourseIds?.indexOf(data?.id) > -1}
                                            onChange={handleChange(data?.id)}>
                                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                                <Typography variant='body1'>{data?.name}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {data?.subjects?.map((data) => (
                                                    <div className='flex items-center  cursor-pointer'
                                                        key={data?.id} onClick={() => onSubjectAssign(data)}
                                                    >
                                                        <Checkbox
                                                            //  checked={props?.assign[index]?.subjectId===data?.id}
                                                            checked={props?.selectedSubjects?.indexOf(data?.id) > -1} />
                                                        <Typography variant='body2'>{data?.name}</Typography>
                                                    </div>
                                                ))}
                                            </AccordionDetails>

                                        </Accordion>
                                    </div>
                                ))}
                            </div>
                            <div className='flex justify-between items-center h-10  sticky right-2 left-2  z-50'>
                                <Typography variant='body2'>{props?.subCount} Subjects </Typography>
                                <div className='flex gap-3 '>
                                    <Button variant="outlined" size="small"
                                        fullWidth
                                        onClick={toggleDrawer(anchor, false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="contained" size="small" fullWidth
                                        onClick={submitFilter}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}
