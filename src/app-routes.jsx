import React from 'react'
import {Route, IndexRoute} from 'react-router'

import Master from './pages/master'
import HomePage from './pages/home'
import PlayGamePage from './pages/play-game'
import ReplayGamesPage from './pages/replay-games'
import ReplayPage from './pages/replay'
import RulesPage from './pages/rules'

const AppRoutes = (
  <Route path="/" component={Master}>
    <Route path="home" component={HomePage} />
    <Route path="play" component={PlayGamePage} />
    <Route path="replay" component={ReplayGamesPage} />
    <Route path="replay/:gameId" component={ReplayPage} />
    <Route path="rules" component={RulesPage} />

     <IndexRoute component={HomePage} />
  </Route>
)

export default AppRoutes;
