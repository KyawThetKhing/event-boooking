import { ref } from 'vue'

const bookings = ref([])
const loading = ref(false)
const error = ref(null)

const fetchBookings = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetch('http://localhost:3001/bookings')
    bookings.value = await response.json()
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}

const findBookingById = (id) => {
  return bookings.value.findIndex((booking) => booking.id === id)
}

const handelRegistration = async (event) => {
  if (bookings.value.some((booking) => booking.eventId === event.id)) {
    alert('You are already registered for this event')
    return
  }

  const newBooking = {
    id: Date.now().toString(),
    userId: 1,
    eventId: event.id,
    eventTitle: event.title,
    status: 'pending',
  }
  try {
    bookings.value.push(newBooking)
    const response = await fetch('http://localhost:3001/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...newBooking, status: 'confrimed' }),
    })

    if (response.ok) {
      const updatedBookings = await response.json()

      const index = findBookingById(newBooking.id)
      bookings.value[index] = updatedBookings
    } else {
      throw new Error('Failed to confirm booking')
    }
  } catch {
    bookings.value = bookings.value.filter((booking) => booking.id !== newBooking.id)
  }
}

const cancelBooking = async (bookingId) => {
  const index = findBookingById(bookingId)
  const originalBooking = bookings.value[index]
  bookings.value.splice(index, 1)
  try {
    const response = await fetch(`http://localhost:3001/bookings/${bookingId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to cancel booking')
    }
  } catch {
    bookings.value.splice(index, 0, originalBooking)
  }
}

export default function useBookings() {
  return {
    bookings,
    loading,
    fetchBookings,
    handelRegistration,
    cancelBooking,
    error,
  }
}
