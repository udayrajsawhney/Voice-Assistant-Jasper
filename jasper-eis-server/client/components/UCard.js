import React, { Component } from 'react'
import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Toggle from 'material-ui/Toggle'
import '../css/ucard.css'

// let expanded = false
// let tog = _ => {expanded = !expanded; console.log(expanded)}

export default class UCard extends Component {
    render() {
        let props = this.props
        return (<Card>
            <CardMedia
                overlay={<CardTitle title={props.ttl} subtitle={props.sub} />}
            >
                <img src={props.sce} alt={props.ate} />
            </CardMedia>
            <CardText>
                {props.desc}
            </CardText>
            <CardActions className="card-actions">
                <FlatButton label="More Info" primary />
                <Toggle
                    className="toggle"
                    toggled={ props.expanded }
                    onToggle={ props.act }
                />
            </CardActions>
        </Card>)
    }
}
