import { Component, OnInit, Output, Input, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
interface TopicTreeNode {
  id: string;
  name: string;
  selectable: string;
  nodes: Array<TopicTreeNode>;
}
@Component({
  selector: 'app-topic-picker',
  templateUrl: './topic-picker.component.html',
  styleUrls: ['./topic-picker.component.css']
})
export class TopicPickerComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() formTopic: any;

  @Input() selectedTopics: any;

  @Input() topicPickerClass: string;

  @Output() topicChange = new EventEmitter();

  public placeHolder: string;

  constructor() {
  }
  ngOnInit() {
    const selectedTopics = _.reduce(this.selectedTopics, (collector, element) => {
      if (typeof element === 'string') {
        collector.unformatted.push(element);
      } else if (_.get(element, 'identifier')) {
        collector.formated.push(element);
      }
      return collector;
    }, { formated: [], unformatted: [] });
    this.formatSelectedTopics(this.formTopic.range, selectedTopics.unformatted, selectedTopics.formated);
    this.selectedTopics =  selectedTopics.formated;
    this.topicChange.emit(this.selectedTopics);
    this.placeHolder = this.selectedTopics.length + ' topics selected';
  }
  private formatSelectedTopics(topics, unformatted, formated) {
    _.forEach(topics, (topic) => {
      if (unformatted.includes(topic.identifier)) {
        formated.push({
          identifier: topic.identifier,
          name: topic.name
        });
      }
      if (topic.children) {
        this.formatSelectedTopics(topic.children, unformatted, formated);
      }
    });
  }
  ngAfterViewInit() {
    this.initTopicPicker(this.formatTopics(this.formTopic.range));
  }
  private initTopicPicker(data: Array<TopicTreeNode>) {
    $('.topic-picker-selector').treePicker({
      data: data,
      name: 'Topics',
      noDataMessage: 'No Topics/SubTopics found',
      picked: _.map(this.selectedTopics, 'identifier'),
      onSubmit: (selectedNodes) => {
        this.selectedTopics = _.map(selectedNodes, node => ({
          identifier: node.id,
          name: node.name
        }));
        this.placeHolder = this.selectedTopics.length + ' topics selected';
        this.topicChange.emit(this.selectedTopics);
      },
      nodeName: 'topicSelector',
      minSearchQueryLength: 1
    });
    setTimeout(() =>
    document.getElementById('topicSelector').classList.add(this.topicPickerClass), 100);
  }
  private formatTopics(topics, subTopic = false): Array<TopicTreeNode> {
    return _.map(topics, (topic) => ({
      id: topic.identifier,
      name: topic.name,
      selectable: subTopic ? 'selectable' : 'notselectable',
      nodes: this.formatTopics(topic.children, true)
    }));
  }
  ngOnDestroy() {
  }
}
