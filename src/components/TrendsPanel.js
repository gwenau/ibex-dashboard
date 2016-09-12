import Fluxxor from 'fluxxor';
import React, { PropTypes, Component } from 'react';
import {Actions} from '../actions/Actions';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';

const FluxMixin = Fluxxor.FluxMixin(React),
      StoreWatchMixin = Fluxxor.StoreWatchMixin("DataStore");

const rowStyle = {
  paddingTop: '2px',
  paddingBottom: '2px'
};

export const TrendsPanel = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin],
  
  getInitialState(){
      this.getFlux().actions.TRENDS.load_trends();
  },
  
  getStateFromFlux: function() {
    return this.getFlux().store("DataStore").getState();
  },
  
  lookupEventSourceIcon(source){
     let icon = Actions.constants.EVENT_SOURCE_ICON_MAP[source];
     
     return icon ? icon : 'N/A';
  },

  volumeFormatter(count){
    let formatedNumber = count;
    let denominator = 1;
    let type = '';

    if(formatedNumber >= 1000 && formatedNumber < 1000000){
      denominator = 1000;
      type = 'k';
    }else if(formatedNumber >= 1000000 && formatedNumber < 1000000000){
      denominator = 1000000;
      type = 'm';
    }else if(formatedNumber >= 1000000000){
      denominator = 1000000000;
      type = 'b';
    }

    return ((formatedNumber / denominator).toFixed(denominator > 1 ? 2 : 0)) + type;
  },

  handleClick(term, type){
    if(term && type){
         this.getFlux().actions.DASHBOARD.changeSearchFilter(term, type);
    }
  },

  defaultSelectionToMostTrendingTerm(){
    if(this.state.categoryValue == "" && this.state.trends.length > 0){
        this.getFlux().actions.DASHBOARD.changeSearchFilter(this.state.trends[0].trendingValue, this.state.trends[0].trendingType);
    }
  },
  
  render() {
    let self = this;
    this.defaultSelectionToMostTrendingTerm();

    return (
     <div className="col-lg-3 trend-column">
       <div className="row">
          <List subheader="What's Trending" className="panel panel-default">
                <div className="list-group list-group-trends" data-scrollable="">
                  {
                        this.state.trends.map((trend, index) => {
                            var bindedClickHandler = self.handleClick.bind(this, trend.trendingValue, trend.trendingType);

                            return <div>
                                    <ListItem primaryText={
                                                <div className="media-body media-body-trends">
                                                    <strong>{trend.trendingType}</strong> -- <a href="#" onClick={bindedClickHandler}>{trend.trendingValue}</a> on <i className={self.lookupEventSourceIcon(trend.source)}></i>
                                                    <div className="pull-right news-feed-content-date">Trending since {trend.trendingTimespan}</div>
                                                </div>
                                            } 
                                            secondaryText={
                                                <p className="media-body">
                                                   {trend.trendingVolume && trend.trendingVolume > 0 ? <span>{self.volumeFormatter(trend.trendingVolume)} {trend.source === 'twitter' ? "tweets" : "activities"}</span> : undefined}
                                                </p>
                                            }
                                            secondaryTextLines={2}
                                            innerDivStyle={rowStyle} />
                                <Divider inset={true} />
                                </div>
                        })
                  }
                </div>
          </List>
        </div>
        <div className="row">
          <List subheader="What's Popular" className="panel panel-default">
                <div className="list-group list-group-trends" data-scrollable="">
                  {
                        this.state.popularTerms.map((trend, index) => {
                            var bindedClickHandler = self.handleClick.bind(this, trend.trendingValue, trend.trendingType);

                            return <div>
                                    <ListItem primaryText={
                                                <div className="media-body media-body-trends">
                                                    <strong>{trend.trendingType}</strong> -- <a href="#" onClick={bindedClickHandler}>{trend.trendingValue}</a> on <i className={self.lookupEventSourceIcon(trend.source)}></i>
                                                    <div className="pull-right news-feed-content-date">mentions between {trend.trendingTimespan}</div>
                                                </div>
                                            } 
                                            secondaryText={
                                                <p className="media-body">
                                                   {trend.trendingVolume && trend.trendingVolume > 0 ? <span>{self.volumeFormatter(trend.trendingVolume)} {trend.source === 'twitter' ? "tweets" : "activities"}</span> : undefined}
                                                </p>
                                            }
                                            secondaryTextLines={2}
                                            innerDivStyle={rowStyle} />
                                <Divider inset={true} />
                                </div>
                        })
                  }
                </div>
          </List>
        </div>
      </div>
     );
  }
});