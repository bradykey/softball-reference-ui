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
   * Retrieve all of the Teams in the database.
   *
   * @returns the collection of Teams in the database
   */
  getTeams() {
    return apiClient.get('/teams');
  },
  /**
   * Retrieve the collection of TeamLeagues associated with the Team name passed in as a query param.
   *
   * @param {string} team the query param used to distinguish the team name of the TeamLeagues to fetch.
   * @returns The array of TeamLeagues with the Team matching the name that was passed in.
   */
  getTeamLeaguesByTeam(team) {
    return apiClient.get('/teamleagues?team=' + team);
  },
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
  },
  /**
   * Retrive the GameSummaries for a TeamLeague. This is wrapped in a
   * GameSummaryResponse from the API and contains information about each game
   * associated with this TeamLeague.
   * @param {int} teamLeagueId the Id of the TeamLeague / Season to retrive the
   * games of.
   * @returns The array of GameSummaryResponses associated with the TeamLeagueId
   * passed in.
   */
  getGamesByTeamLeague(teamLeagueId) {
    return apiClient.get('/teamleagues/' + teamLeagueId + '/games');
  },
  /**
   * Retrieve the Game by its Id. This contains all the information about the
   * game as well as the StatLines of the Players who played that game.
   * @param {int} gameId the Id of the Game to retrieve.
   * @returns The Game associated with the gameId.
   */
  getGameById(gameId) {
    return apiClient.get('/games/' + gameId);
  }
};
