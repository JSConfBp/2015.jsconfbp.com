$(function () {
	var dates = ['2015/05/14', '2015/05/15'];
	var schedule = $('.schedule-table');
	var liveBox = $('.live-box');
	var days = [];

	days[0] = getScheduleForDay(0);
	days[1] = getScheduleForDay(1);

	console.log(days);
	function getScheduleForDay (day) {
		var container = schedule.eq(day),
			data = [];

		container.find('tr').each(function (i, row) {
			row = $(row);

			if (i === 0) {
				return;
			}

			var time = row.find('.time').text().split(' - '),
				title = row.find('.title'),
				talk = title.find('.talk'),
				speaker = title.find('.name'),
				scheduleRow;

			scheduleRow = {
				start: dates[day] + ' ' + time[0],
				end: dates[day] + ' ' + time[1],
				title: talk.length ? talk.text() : title.text()
			};

			scheduleRow.startDate = new Date(scheduleRow.start);
			scheduleRow.endDate = new Date(scheduleRow.end);
			scheduleRow.startTs = scheduleRow.startDate.getTime();
			scheduleRow.endTs = scheduleRow.endDate.getTime();
			scheduleRow.node = row;

			if (speaker.length) {
				scheduleRow.speaker = speaker.text();
			}

			data.push(scheduleRow);
		});

		return data;
	}

	function getCurrentRow () {
		var currentTs = new Date().getTime(),
			row;

		for (var i = 0; i < 2; i++) {
			for (var j = 0; j < days[i].length; j++) {
				row = days[i][j];

				if (currentTs > row.startTs && currentTs < row.endTs) {
					return row;
				}
			}
		}

		return {};
	}

	function updateSchedule () {
		var current = getCurrentRow();


		current.node && current.node.addClass('active');

		liveBox.find('.talk').text(current.title || 'There is no event right now. Stay tuned!');

		if (current.speaker) {
			liveBox.find('.speaker-name').text('by ' + current.speaker);
		}
	}

	updateSchedule();
	setInterval(function () {
		updateSchedule();
	}, 5000);
});
