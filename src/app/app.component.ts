import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Team } from './team';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  members: string[] = [];
  maxTeamSize = Array(10);
  maxNumberOfTeams = Array(10);
  defaultTeamSize = 2;
  teams: Team[];
  notEnoughMembersSelected = false;

  teamGeneratorForm = new FormGroup({
    name: new FormControl(''),
    numberOfTeams: new FormControl(''),
    teamSize: new FormControl(''),
  });

  constructor() {
  }

  addPlayer(): void {
    const playerName = this.controls.name;
    if(playerName.value && playerName.value != '') {
      this.members.push(playerName.value);
      playerName.reset();

      if(this.members.length > 1) {
        this.notEnoughMembersSelected = false;
      }
    }
  }

  removePlayer(index: number):void {
    this.members.splice(index, 1);
  }

  generateTeams(): void {
    this.teams = [];

    if(this.members.length < 2) {
      this.notEnoughMembersSelected = true;
      return;
    }

    this.notEnoughMembersSelected = false;
    const numberOfTeams = this.getNumberOfTeams();
    const teamSize = this.getTeamSize();
    const shuffledMembers = this.getRandomized(this.members);

    for(let i = 0; i < numberOfTeams; i++) {
      let team = new Team();
      team.members = shuffledMembers.splice(0, teamSize);
      if(team.members.length > 0) {
        this.teams.push(team);
      }
    }
  }

  private getNumberOfTeams():number {
    const numberOfTeams = this.controls.numberOfTeams.value;
    const teamSize = this.controls.teamSize.value;
    const numberOfTeamsBySize = Math.round(this.members.length / teamSize);

    if(!teamSize && !numberOfTeams) {
      return this.defaultTeamSize;
    }

    return numberOfTeams ? numberOfTeams : numberOfTeamsBySize;
  }

  private getTeamSize():number {
    const numberOfTeams = this.controls.numberOfTeams.value;
    const teamSize = this.controls.teamSize.value;
    const teamSizeByNumberOfTeams = Math.round(this.members.length / numberOfTeams);

    if(!teamSize && !numberOfTeams) {
      return  Math.round(this.members.length / this.defaultTeamSize);
    }

    return teamSize ? teamSize : teamSizeByNumberOfTeams;
  }

  private getRandomized(values: string[]): string[] {
    return values.map((a) => ({sort: Math.random(), value: a}))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
  }

  private get controls() {
    return this.teamGeneratorForm.controls;
  }
}
