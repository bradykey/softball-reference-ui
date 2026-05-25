import axios from 'axios';
import store from '@/store/store';
import router from '@/router/router';

/**
 * Specifically only want to have a singleton instance of the API Client. This
 * service file will allow any component within the application to make api
 * calls from the same axios instance.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

/* Attach the JWT (if any) to every outbound request. */
apiClient.interceptors.request.use(config => {
  const token = store.state.authToken;
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

/* If the server says the token is bad/expired, clear it and bounce to login. */
apiClient.interceptors.response.use(
  response => response,
  error => {
    const status = error.response && error.response.status;
    if (status === 401 || status === 403) {
      if (store.state.authToken) {
        store.dispatch('logout');
      }
      const current = router.currentRoute.value;
      if (
        current &&
        current.path.startsWith('/admin') &&
        current.name !== 'Login'
      ) {
        router.replace({
          name: 'Login',
          query: { redirect: current.fullPath }
        });
      }
    }
    return Promise.reject(error);
  }
);

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
  },
  /**
   * Retrieve the roster (TeamLeaguePlayers) for a given TeamLeague.
   * @param {int} teamLeagueId
   * @returns Array of {teamLeaguePlayerId, name, teamLeagueId}
   */
  getRoster(teamLeagueId) {
    return apiClient.get('/teamleagues/' + teamLeagueId + '/players');
  },
  /**
   * Create a new Game for a TeamLeague. Returns the created Game including
   * its server-generated gameId, which is needed for subsequent StatLine
   * POSTs.
   * @param {Object} payload See backend GameRequest DTO.
   */
  createGame(payload) {
    return apiClient.post('/games', payload);
  },
  /**
   * Create a single StatLine for a Game. The POST DTO uses Jackson-derived
   * camelCase keys (pA, hR, rBI, ...) — different from the GET response shape.
   * @param {Object} payload See backend StatLineRequest DTO.
   */
  createStatLine(payload) {
    return apiClient.post('/statlines', payload);
  },
  /**
   * Exchange admin username/password for a JWT.
   * @param {{username: string, password: string}} credentials
   * @returns Promise resolving to { token, expiresInMs }
   */
  login(credentials) {
    return apiClient.post('/auth/login', credentials);
  }
};
