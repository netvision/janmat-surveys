<template>
  <q-page padding>
    <!-- User Form -->
    <q-form @submit="handleSubmit" class="q-gutter-md" ref="userForm">
      <h2>{{ isEditMode ? 'Edit User' : 'Create User' }}</h2>

      <!-- First Name -->
      <q-input
        v-model="form.first_name"
        label="First Name"
        filled
        :rules="[val => !!val || 'First name is required']"
        required
      />

      <!-- Last Name -->
      <q-input
        v-model="form.last_name"
        label="Last Name"
        filled
        :rules="[val => !!val || 'Last name is required']"
        required
      />

      <!-- Email -->
      <q-input
        v-model="form.email"
        label="Email"
        filled
        :rules="[
          val => !!val || 'Email is required',
          val => /^\S+@\S+\.\S+$/.test(val) || 'Invalid email format'
        ]"
        required
        :readonly="isEditMode"
      />

      <!-- Phone -->
      <q-input
        v-model="form.phone"
        label="Phone"
        type="tel"
        filled
        :rules="[
          val => !!val || 'Phone number is required',
          val => /^[0-9]+$/.test(val) || 'Phone number should contain only numbers'
        ]"
        required
      />

      <!-- Submit Button -->
      <q-btn
        type="submit"
        :label="isEditMode ? 'Save Changes' : 'Create User'"
        color="primary"
        unelevated
        :loading="isSubmitting"
      />
      <q-btn
        v-if="isEditMode"
        label="Cancel"
        color="negative"
        flat
        @click="cancelEdit"
      />
    </q-form>

    <q-separator class="q-mt-md" />

    <!-- User List -->
    <h2>Users List</h2>
    <q-table
      :rows="users"
      :columns="columns"
      row-key="id"
      flat
      bordered
      class="q-mt-md"
    >
      <template v-slot:body-cell-actions="props">
        <q-btn
          color="primary"
          flat
          icon="edit"
          @click="editUser(props.row)"
        />
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';

// Form state
const form = ref({
  id: null,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
});

const isEditMode = ref(false); // Track whether in edit mode
const isSubmitting = ref(false); // Track submission state
const users = ref([]); // List of users
const userForm = ref(null); // Ref for the form
const $q = useQuasar(); // Quasar utilities

// Table columns
const columns = [
  { name: 'first_name', required: true, label: 'First Name', align: 'left', field: 'first_name' },
  { name: 'last_name', required: true, label: 'Last Name', align: 'left', field: 'last_name' },
  { name: 'email', required: true, label: 'Email', align: 'left', field: 'email' },
  { name: 'phone', required: true, label: 'Phone', align: 'left', field: 'phone' },
  { name: 'actions', label: 'Actions', align: 'center' },
];

// Fetch users from the API
const fetchUsers = async () => {
  try {
    const response = await api.get('/janmat-users'); // Replace with your API endpoint
    users.value = response.data; // Assuming API returns an array of users
  } catch (error) {
    console.error('Error fetching users:', error);
    $q.notify({ type: 'negative', message: 'Failed to fetch users.' });
  }
};

// Handle form submission
const handleSubmit = async () => {
  if (isSubmitting.value) return;

  // Validate the form
  if (!userForm.value.validate()) {
    $q.notify({ type: 'negative', message: 'Please correct the errors in the form.' });
    return;
  }

  isSubmitting.value = true;

  try {
    if (isEditMode.value) {
      // Update user
      await api.put(`/janmat-users/${form.value.id}`, form.value); // Replace with your API endpoint
      $q.notify({ type: 'positive', message: 'User updated successfully!' });
    } else {
      // Create user
      const response = await api.post('/janmat-users', form.value); // Replace with your API endpoint
      users.value.push(response.data); // Add new user to the list
      $q.notify({ type: 'positive', message: 'User created successfully!' });
    }

    cancelEdit(); // Reset the form and exit edit mode
    fetchUsers(); // Refresh the user list
  } catch (error) {
    console.error('Error saving user:', error);
    $q.notify({ type: 'negative', message: 'Failed to save user. Please try again.' });
  } finally {
    isSubmitting.value = false;
  }
};

// Edit user
const editUser = (user) => {
  form.value = { ...user };
  isEditMode.value = true;
};

// Cancel edit mode
const cancelEdit = () => {
  form.value = {
    id: null,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  };
  isEditMode.value = false;
};

// Fetch users on mount
onMounted(() => {
  fetchUsers();
});
</script>

<style>
/* Optional custom styles */
</style>
