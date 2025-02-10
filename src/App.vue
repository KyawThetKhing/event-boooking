<template>
  <main class="container mx-auto my-8 space-y-8">
    <h1 class="text-4xl">Event Booking App</h1>

    <h2 class="text-2xl font-medium">All Events</h2>
    <EventList @register="handelRegistration($event)" />
    <h2 class="text-2xl font-medium">Your Bookings</h2>
    <section class="grid grid-cols-1 gap-4">
      <template v-if="!bookingsLoading">
        <BookingItem
          v-for="booking in bookings"
          :key="booking.id"
          :title="booking.eventTitle"
          :status="booking.status"
          @cancelled="cancelBooking(booking.id)"
        />
      </template>
      <template v-else>
        <LoadingBookingItem v-for="i in 4" :key="i" />
      </template>
    </section>
  </main>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import LoadingBookingItem from '@/components/LoadingBookingItem.vue'
import BookingItem from '@/components/BookingItem.vue'
import EventList from '@/components/EventList.vue'

const bookings = ref([])
const bookingsLoading = ref(false)

const fetchBookings = async () => {
  bookingsLoading.value = true
  try {
    const response = await fetch('http://localhost:3001/bookings')
    bookings.value = await response.json()
  } catch (error) {
    console.error('Error fetching bookings:', error)
  } finally {
    bookingsLoading.value = false
  }
}

onMounted(() => {
  fetchBookings()
})

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
  } catch (error) {
    console.log('🚀 ~ handelRegistration ~ error:', error)
    bookings.value = bookings.value.filter((booking) => booking.id !== newBooking.id)
  } finally {
    // fetchBookings()
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
  } catch (e) {
    console.error('Error cancelling booking:', e)
    bookings.value.splice(index, 0, originalBooking)
  }
}
</script>
