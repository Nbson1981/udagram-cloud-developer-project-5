import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createMember, deleteMember, getMembers, patchMember } from '../api/members-api'
import Auth from '../auth/Auth'
import { Member } from '../types/Member'

interface MembersProps {
  auth: Auth
  history: History
}

interface MembersState {
  members: Member[]
  newMemberName: string
  loadingMembers: boolean
}

export class Members extends React.PureComponent<MembersProps, MembersState> {
  state: MembersState = {
    members: [],
    newMemberName: '',
    loadingMembers: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newMemberName: event.target.value })
  }

  onEditButtonClick = (memberId: string) => {
    this.props.history.push(`/members/${memberId}/edit`)
  }

  onMemberCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const joinedDate = this.calculateDueDate()
      const newMember = await createMember(this.props.auth.getIdToken(), {
        name: this.state.newMemberName,
        joinedDate
      })
      this.setState({
        members: [...this.state.members, newMember],
        newMemberName: ''
      })
    } catch {
      alert('Member creation failed')
    }
  }

  onMemberDelete = async (memberId: string) => {
    try {
      await deleteMember(this.props.auth.getIdToken(), memberId)
      this.setState({
        members: this.state.members.filter(member => member.memberId !== memberId)
      })
    } catch {
      alert('Member deletion failed')
    }
  }

  onMemberCheck = async (pos: number) => {
    try {
      const member = this.state.members[pos]
      await patchMember(this.props.auth.getIdToken(), member.memberId, {
        name: member.name,
        joinedDate: member.joinedDate,
        active: !member.active
      })
      this.setState({
        members: update(this.state.members, {
          [pos]: { active: { $set: !member.active } }
        })
      })
    } catch {
      alert('Member deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const members = await getMembers(this.props.auth.getIdToken())
      this.setState({
        members,
        loadingMembers: false
      })
    } catch (e) {
      alert(`Failed to fetch members: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Members</Header>

        {this.renderCreateMemberInput()}

        {this.renderMembers()}
      </div>
    )
  }

  renderCreateMemberInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Member',
              onClick: this.onMemberCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Member name..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderMembers() {
    if (this.state.loadingMembers) {
      return this.renderLoading()
    }

    return this.renderMembersList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Members
        </Loader>
      </Grid.Row>
    )
  }

  renderMembersList() {
    return (
      <Grid padded>
        {this.state.members.map((member, pos) => {
          return (
            <Grid.Row key={member.memberId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onMemberCheck(pos)}
                  checked={member.active}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {member.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {member.joinedDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(member.memberId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onMemberDelete(member.memberId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {member.attachmentUrl && (
                <Image src={member.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate())

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
