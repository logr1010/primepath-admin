import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export const PayoutComponent = ({ min = 0, max = 0, onSumbit }) => {
    const [minAmount, setMinAmount] = React.useState(min);
    const [maxAmount, setMaxAmount] = React.useState(max);

    React.useEffect(() => {
        setMinAmount(min)
        setMaxAmount(max)
    }, [min, max])

    return (
        <Card sx={{ minWidth: 345, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="Payout Settings" />
            <CardContent className='flex flex-col gap-2 flex-1'>
                <TextField
                    label="Minimum Payout Amount"
                    variant='filled'
                    placeholder='Enter Amount'
                    type='number'
                    value={minAmount}
                    onChange={(e) => setMinAmount(e?.target?.value)}
                    fullWidth
                />
                <TextField
                    variant='filled'
                    label='Maximum Payout Amount'
                    placeholder='Enter Amount'
                    type='number'
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e?.target?.value)}
                    fullWidth
                />
            </CardContent>
            <CardActions className='flex justify-end'>
                <Button
                    disabled={!minAmount || !maxAmount}
                    onClick={() => onSumbit({
                        maxamount: maxAmount,
                        minamount: minAmount
                    })}
                    variant='contained'>
                    UPDATE
                </Button>
            </CardActions>
        </Card>
    )
}

export const HomeInfo = ({ data, onSumbit }) => {
    const [avoid, setAvoid] = React.useState(data?.avoid || '');
    const [info, setInfo] = React.useState(data?.info || '');
    const [secure, setSecure] = React.useState(data?.secure || '');

    React.useEffect(() => {
        setInfo(data?.info)
        setAvoid(data?.avoid)
        setSecure(data?.secure)
    }, [data])

    return (
        <Card sx={{ minWidth: 345, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="Home Info" />
            <CardContent className='flex flex-col gap-2 flex-1'>
                <TextField
                    label="Info"
                    variant='filled'
                    placeholder='Type here'
                    type='text'
                    value={info}
                    onChange={(e) => setInfo(e?.target?.value)}
                    fullWidth
                />
                <TextField
                    variant='filled'
                    label='Avoid'
                    placeholder='Type here'
                    type='text'
                    value={avoid}
                    onChange={(e) => setAvoid(e?.target?.value)}
                    fullWidth
                />
                <TextField
                    variant='filled'
                    label='Secure'
                    placeholder='Type here'
                    type='text'
                    value={secure}
                    onChange={(e) => setSecure(e?.target?.value)}
                    fullWidth
                />
            </CardContent>
            <CardActions className='flex justify-end'>
                <Button
                    disabled={!info || !avoid || !secure}
                    onClick={() => onSumbit({
                        avoid, info, secure
                    })}
                    variant='contained'>
                    UPDATE
                </Button>
            </CardActions>
        </Card>
    )

}


export const Timings = ({ data, onSumbit }) => {
    const [local, setLocal] = React.useState(data?.local || { open: '', close: '' });
    const [domestic, setDomestic] = React.useState(data?.domestic || { open: '', close: '' });

    // console.log(data)
    React.useEffect(() => {
        setLocal(data?.local)
        setDomestic(data?.domestic)
    }, [data])

    const isDisabled = () => {
        if (!local) return true
        if (!domestic) return true
        if (parseInt(local?.open) >= 0 && parseInt(local?.close) >= 0 && parseInt(domestic?.open) >= 0 && parseInt(domestic?.close) >= 0) return false
        else return true
    }


    return (
        <Card sx={{ minWidth: 345, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="Timings" />
            <CardContent className='flex flex-col gap-2 flex-1'>
                <Typography variant="body1" color="text.secondary">Local</Typography>
                <div className='flex gap-2'>
                    <TextField
                        label="Open"
                        variant='filled'
                        placeholder='Type here'
                        type='number'
                        value={local?.open}
                        onChange={(e) => setLocal({ ...local, open: e?.target?.value })}
                        fullWidth
                    />
                    <TextField
                        variant='filled'
                        label='Close'
                        placeholder='Type here'
                        type='number'
                        value={local?.close}
                        onChange={(e) => setLocal({ ...local, close: e?.target?.value })}
                        fullWidth
                    />
                </div>
                <Typography variant="body1" color="text.secondary">Pan India</Typography>
                <div className='flex gap-2'>
                    <TextField
                        label="Open"
                        variant='filled'
                        placeholder='Type here'
                        type='number'
                        value={domestic?.open}
                        onChange={(e) => setDomestic({ ...local, open: e?.target?.value })}
                        fullWidth
                    />
                    <TextField
                        variant='filled'
                        label='Close'
                        placeholder='Type here'
                        type='number'
                        value={domestic?.close}
                        onChange={(e) => setDomestic({ ...local, close: e?.target?.value })}
                        fullWidth
                    />
                </div>
            </CardContent>
            <CardActions className='flex justify-end'>
                <Button
                    disabled={isDisabled()}
                    onClick={() => onSumbit({
                        local, domestic
                    })}
                    variant='contained'>
                    UPDATE
                </Button>
            </CardActions>
        </Card>
    )

}



export const ReadBeforeYouBook = ({ data, onSumbit }) => {

    const [text, setText] = React.useState(data || ['', '', '', '', '']);

    // console.log(data)
    React.useEffect(() => {
        setText(data || ['', '', '', '', ''])
    }, [data])

    const setTextIndex = (index, value) => {
        let arr = [...text]
        arr[index] = value
        setText(arr)
    }
    return (
        <Card sx={{ minWidth: 345, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="Read before you book" />
            <CardContent className='flex flex-col gap-2 flex-1'>
                <Typography variant="body1" color="text.secondary">Enter 5 points to diplay in read before you book</Typography>
                <div className='flex flex-col gap-6'>
                    {text?.map((item, index) => (
                        <TextField
                            key={index}
                            label={"Enter Point No. " + (index + 1)}
                            variant='filled'
                            placeholder='Start Typing...'
                            type='text'
                            value={text[index]}
                            onChange={(e) => setTextIndex(index, e.target.value)}
                            fullWidth
                        />
                    ))}
                </div>
            </CardContent>
            <CardActions className='flex justify-end'>
                <Button
                    disabled={text.includes('')}
                    onClick={() => onSumbit(text)}
                    variant='contained'>
                    UPDATE
                </Button>
            </CardActions>
        </Card>
    )

}