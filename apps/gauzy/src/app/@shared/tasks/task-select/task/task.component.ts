import { Component, OnInit, OnDestroy, Input, forwardRef } from '@angular/core';
import { Task } from '@gauzy/models';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { TasksService } from 'apps/gauzy/src/app/@core/services/tasks.service';
import { NbDialogService } from '@nebular/theme';
import { AddTaskDialogComponent } from '../../add-task-dialog/add-task-dialog.component';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
	selector: 'ga-task-selector',
	templateUrl: './task.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TaskSelectorComponent),
			multi: true
		}
	]
})
export class TaskSelectorComponent
	implements OnInit, OnDestroy, ControlValueAccessor {
	tasks: Task[];

	private _projectId;

	onChange: any = () => {};
	onTouched: any = () => {};
	val: any;

	@Input() disabled = false;
	@Input() allowAddNew = true;

	@Input()
	public get projectId() {
		return this._projectId;
	}
	public set projectId(value) {
		this._projectId = value;
		this.loadTasks();
	}

	set taskId(val: string) {
		// this value is updated by programmatic changes if( val !== undefined && this.val !== val){
		this.val = val;
		this.onChange(val);
		this.onTouched(val);
	}
	get taskId() {
		// this value is updated by programmatic changes if( val !== undefined && this.val !== val){
		return this.val;
	}

	constructor(
		private tasksService: TasksService,
		private dialogService: NbDialogService
	) {}

	ngOnInit() {}

	private async loadTasks(): Promise<void> {
		const { items = [] } = await this.tasksService
			.getAllTasks({ projectId: this.projectId })
			.toPromise();

		this.tasks = items;

		if (
			items.length === 0 ||
			items.find((item) => this.taskId !== item.id)
		) {
			this.taskId = null;
		}
	}

	writeValue(value: any) {
		this.taskId = value;
	}
	registerOnChange(fn: (rating: number) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	createNew = (name: string) => {
		this.dialogService
			.open(AddTaskDialogComponent, {
				context: {
					createTask: true,
					task: {
						title: name,
						projectId: this.projectId
					}
				}
			})
			.onClose.pipe(untilDestroyed(this))
			.subscribe((task) => {
				if (task) {
					this.tasks = this.tasks.concat(task);
					this.taskId = task.id;
				}
			});
	};

	ngOnDestroy() {}
}
