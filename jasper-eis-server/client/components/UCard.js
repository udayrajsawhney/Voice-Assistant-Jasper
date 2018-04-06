import React, { Component, Fragment } from 'react'
import { Card, CardActions, CardMedia, CardText } from 'material-ui/Card' // CardTitle
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Toggle from 'material-ui/Toggle'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import '../css/ucard.css'

// let expanded = false
// let tog = _ => {expanded = !expanded; console.log(expanded)}

/* overlay={<CardTitle title={props.ttl} subtitle={props.sub} />} */

export default class UCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
        }
    }

    handleOpen(){
        this.setState({open: true});
    }

    handleClose(){
        this.setState({open: false});
    }

    render() {
        const actions = [
            <FlatButton
              label="Close"
              primary={true}
              onClick={_ => this.handleClose()}
            />
          ]
        let props = this.props
        return (<Fragment>
                    <Card>
                    <CardMedia
                    >
                        <img src={props.sce} alt={props.ate} />
                    </CardMedia>
                    <CardText>
                        {props.desc}
                    </CardText>
                    <CardActions className="card-actions">
                        <FlatButton label="More Info" onClick={_ => {this.handleOpen(); props.reqData()}} primary />
                        <Toggle
                            className="toggle"
                            toggled={ props.expanded }
                            onToggle={ props.act }
                        />
                    </CardActions>
                </Card>
                <Dialog
                    title={props.ate}
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={_ => this.handleClose()}
                    >
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderColumn>StartTime</TableHeaderColumn>
                                <TableHeaderColumn>EndTime</TableHeaderColumn>
                                <TableHeaderColumn>Duration</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                props.tabp && props.tabp.map(r => <TableRow><TableRowColumn>{r.start}</TableRowColumn><TableRowColumn>{r.stop}</TableRowColumn><TableRowColumn>{r.duration}</TableRowColumn></TableRow>)
                            }
                        </TableBody>
                    </Table>
                </Dialog>
        </Fragment>)
    }
}
