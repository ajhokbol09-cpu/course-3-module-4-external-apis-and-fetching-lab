const weatherApi = "https://api.weather.gov/alerts/active?area="

document.addEventListener("DOMContentLoaded", () => {
  const stateInput = document.getElementById("state-input")
  const fetchButton = document.getElementById("fetch-alerts")
  const alertsDisplay = document.getElementById("alerts-display")
  const errorMessage = document.getElementById("error-message")
  const loadingSpinner = document.getElementById("loading-spinner")

  if (fetchButton.dataset.weatherAlertsInitialized) return
  fetchButton.dataset.weatherAlertsInitialized = "true"

  function displayError(message) {
    errorMessage.textContent = message
    errorMessage.classList.remove("hidden")
  }

  function displayAlerts(data) {
    alertsDisplay.replaceChildren()

    const summary = document.createElement("p")
    summary.textContent = `${data.title}: ${data.features.length}`
    alertsDisplay.append(summary)

    const alertList = document.createElement("ul")

    data.features.forEach((alert) => {
      if (alert.properties && alert.properties.headline) {
        const listItem = document.createElement("li")
        listItem.textContent = alert.properties.headline
        alertList.append(listItem)
      }
    })

    alertsDisplay.append(alertList)
  }

  async function fetchWeatherAlerts(state) {
    try {
      const response = await fetch(`${weatherApi}${state}`)

      if (!response.ok) {
        throw new Error("Could not get weather alerts. Please try again.")
      }

      const data = await response.json()

      if (!Array.isArray(data.features)) {
        throw new Error("The weather alerts data was not in the expected format.")
      }

      displayAlerts(data)
      errorMessage.textContent = ""
      errorMessage.classList.add("hidden")
    } catch (error) {
      displayError(error.message)
    } finally {
      loadingSpinner.classList.add("hidden")
      fetchButton.disabled = false
    }
  }

  fetchButton.addEventListener("click", () => {
    const state = stateInput.value.trim()
    stateInput.value = ""
    alertsDisplay.replaceChildren()
    errorMessage.textContent = ""
    errorMessage.classList.add("hidden")

    if (!/^[A-Z]{2}$/.test(state)) {
      displayError("Enter a valid two-letter U.S. state abbreviation.")
      return
    }

    loadingSpinner.classList.remove("hidden")
    fetchButton.disabled = true
    fetchWeatherAlerts(state)
  })
})