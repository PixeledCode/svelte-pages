export const listOfCharts = [
	'assistance_received_during_journey',
	'experience_difficulty_receiving_support_during_journey',
	'experience_discrimination_y_n',
	'personal_local_bank_account_in_admin0_y_n'
];

export const filterOptions = [
	{
		label: 'Gender',
		name: 'gender',
		options: [
			{
				label: 'All',
				value: 'all'
			},
			{
				label: 'Female',
				value: 'female'
			},
			{
				label: 'Male',
				value: 'male'
			}
		]
	},
	{
		label: 'Age Group',
		name: 'age_group',
		options: [
			{
				label: 'All',
				value: 'all'
			},
			{
				label: '18-29',
				value: '18-29'
			},
			{
				label: '30-39',
				value: '30-39'
			},
			{
				label: '40-49',
				value: '40-49'
			},
			{
				label: '50-59',
				value: '50-59'
			},
			{
				label: '60+',
				value: '60+'
			}
		]
	}
];
