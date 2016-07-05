import express from 'express';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../webpack.config';

import React from 'react';
import { RoutingContext, match } from 'react-router';
import { Provider } from 'react-redux';
import createLocation from 'history/lib/createLocation';

import configureStore from '../common/store/configureStore';
import routes from '../common/routes';

const app = express();

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

const renderFullPage = (html, initialState) => {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
}

app.get('/api', function (req, res) {
  console.log(req,res)
});

app.get('/*', function (req, res) {

  const location = createLocation(req.url);

  console.log('######## Rendered by Server #######');

  match({ routes, location }, (err, redirectLocation, renderProps) => {

    if(err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }

    if(!renderProps)
      return res.status(404).end('Not found');

    const store = configureStore(renderProps.params);

    const InitialView = (
      <Provider store={store}>
        {() =>
          <RoutingContext {...renderProps} />
        }
      </Provider>
    );

    const componentHTML = React.renderToString(InitialView);
    const initialState = store.getState();
    res.send(renderFullPage(componentHTML,initialState))

  });
});

var server = app.listen(3002, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});