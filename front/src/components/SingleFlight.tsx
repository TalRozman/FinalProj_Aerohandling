import { CloseOutlined } from '@mui/icons-material'
import { Modal } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { modalStyle } from '../env'
import { selectSingleFlightModal, setSingleFlightModal } from '../features/DailySchedule/dailySlice'

const SingleFlight = (props: any) => {
  const modalView = useAppSelector(selectSingleFlightModal)
  const dispatch = useAppDispatch()
  return (
    <Modal open={modalView}>
      <Box sx={modalStyle}>
        <button className='btn' onClick={() => dispatch(setSingleFlightModal())}>
          <CloseOutlined />
        </button>
        <br />
        <h1>{props.flightId}</h1>
      </Box>
    </Modal>
  )
}

export default SingleFlight