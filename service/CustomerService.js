// service/CustomerService.js
export const CustomerService = {
    async getCustomersMedium() {
      // Replace with your actual data fetching logic
      // Example using fetch to get data from an API
      const jwt = localStorage.getItem('jwt');
            const response = await fetch('https://backend.eyhadvocates.com/api/cases?populate=*', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    }
  };
  