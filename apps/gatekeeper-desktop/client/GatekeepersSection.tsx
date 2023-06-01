import React, { useEffect } from 'react';
import { Section } from './Section';

import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { GatekeeperModel } from '../lib/models';
import { dialogViewModel } from './Dialog';
import './GatekeepersSection.css';
import { trpc } from './trpc';
import { Switch } from './Switch';

import addSvg from '../assets/icons/noun-add-961411.svg'

class ViewModel {
	public gatekeepers: GatekeeperModel[] = []

	constructor() {
		makeAutoObservable(this)
	}

	onFetch(gatekeepers: GatekeeperModel[]) {
		this.gatekeepers = gatekeepers
	}

	refetch() {
		trpc.gatekeepers.get.query().then(({ gatekeepers }) => {
			this.onFetch(gatekeepers)
		})
	}

	update(gatekeeper: GatekeeperModel) {
		trpc.gatekeepers.update.mutate(gatekeeper).then(() => {
			this.refetch()
		})
	}
}

const viewModel = new ViewModel()
export const gatekeepersViewModel = viewModel;

export const GatekeepersSection = observer(() => {
	const gatekeepers = [...viewModel.gatekeepers]
	// .sort(activeFirstSort)

	useEffect(() =>
		viewModel.refetch()
		, []);

	return <div className="gatekeeper-blocks">
		<button className="gatekeeper-block" onClick={() => dialogViewModel.openModal()}>
			<span>הוסף גייטר</span>
			<img src="https://thenounproject.com/api/private/icons/961411/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0&token=gAAAAABkeJn9HN7VMe8IYl-_MtvnfjeBFUMKaral2lPFcgssPIlpRbQ811Lxm9LCcKHfsaapPCxwPcwXDj4iIy6uIw7spxrsqg%3D%3D" width={40} height={40} />

		</button>
		{gatekeepers.map(gatekeeper => {
			return <div className="gatekeeper-block gatekeeper-block-gater">
				<div className="gatekeeper-block__isActive">
					<Switch checked={gatekeeper.isActive} onChange={e =>
						viewModel.update({ ...gatekeeper, isActive: !gatekeeper.isActive })
					} />
				</div>
				<div className="header-and-subheader">
					<span className=''>{gatekeeper.fullname}</span>
					<span>
						{gatekeeper.isActive ? 'פעיל' : 'לא פעיל'}
						<span data-active={gatekeeper.isActive} className="box-indicator"></span>
					</span>
				</div>
			</div>;
		})}
	</div>
})

function activeFirstSort(a: GatekeeperModel, b: GatekeeperModel) {
	if (a.isActive === b.isActive) {
		return 0
	}

	if (a.isActive) {
		return -1
	}

	return 1
}