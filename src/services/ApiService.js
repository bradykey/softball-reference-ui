import axios from 'axios';

/**
 * Specifically only want to have a singleton instance of the API Client. This
 * service file will allow any component within the application to make api
 * calls from the same axios instance.
 */
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_AXIOS_BASE_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  /**
   * This service is going to export all the methods to be exposed for the app.
   *
   * ALL AXIOS EVENTS RETURN A PROMISE SO WE MUST RETURN IT AS WELL.
   */

  /**
   * Retrieve the Season Summary for a TeamLeague. This is wrapped up in the
   * SummaryStatLineResponse from the API and contains all the information about
   * this TeamLeague's season for all their players.
   *
   * @param {int} teamLeagueId The Id of the TeamLeague / Season to retrive the
   * SummaryStatLineResponse of.
   * @returns The SummaryStatLineResponse for the TeamLeagueId passed in.
   */
  getSeasonSummaryStatLines(teamLeagueId) {
    return apiClient.get('/teamleagues/' + teamLeagueId);
  }
};
