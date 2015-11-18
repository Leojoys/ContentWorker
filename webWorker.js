importScripts("https://raw.githubusercontent.com/Leojoys/ContentWorker/master/knockout-2.0.0.js");
importScripts("https://raw.githubusercontent.com/Leojoys/ContentWorker/master/Knockout-projection.js");
importScripts("https://raw.githubusercontent.com/Leojoys/ContentWorker/master/komapping.js")
BlurbStatus = {
    New: 1,
    Unapproved: 2,
    Published: 3,
    Suspended: 4,
    UnPublished: 5
}
self.addEventListener('message', function (e) {
    debugger
    var rawdata = e.data;
    var data=rawdata.param
    switch (rawdata.cmd) {
        case 'start':
            processdata(JSON.parse(data), JSON.parse(rawdata.RawData), JSON.parse(rawdata.Teams), JSON.parse(rawdata.TeamBlurbs));
            break;
        case 'loading':
           processdataLoading(JSON.parse(data), JSON.parse(rawdata.RawData), JSON.parse(rawdata.Teams), JSON.parse(rawdata.TeamBlurbs),rawdata.CurrentBlurbStatus);
        break;

    }
})
function processdataLoading(data, RawData, teams, TeamBlurbs, CurrentBlurbStatus) {
  
    for (var i = 0; i < data.Blurbs.length; i++) {
         var j = 0;
        setTimeout(function () {

            if (CurrentBlurbStatus == BlurbStatus.New) {
                data.Blurbs[j].IsShareToFacebook = RawData.IsShareToFacebook
                data.Blurbs[j].IsShareToTwitter = RawData.IsShareToTwitter
                data.Blurbs[j].IsShareToLinkedIn = RawData.IsShareToLinkedIn
            }
            data.Blurbs[j].PerformingAction = false;
            data.Blurbs[j].showRejectOption = false;
           
            var CurrentTeamBlurbs = TeamBlurbs.filter(function (teamBlurb) {
                return teamBlurb.BlurbId == data.Blurbs[j].BlurbId
            })

            teams.filter(function (filter) {
                CurrentTeamBlurbs.filter(function (currentTeamBlurb) {
                    if (currentTeamBlurb.TeamId == filter.TeamId)
                        filter.Selected = true;
                })
            })

            data.Blurbs[j].Teams = teams;
            self.postMessage({ 'obj': data.Blurbs[j], 'loadblurbs': true });
          //  Blurbs.push(ko.mapping.fromJS(data.Blurbs[j]));
          //  model.isAllSelected(false);
            j = j + 1;
        }, 500);
    }
}

function processdata(data, RawData, teams, TeamBlurbs)
{
   
    for (var i = 0; i < data.Blurbs.length; i++) {
        var j = 0;
        setTimeout(function () {
            data.Blurbs[j].IsShareToFacebook = RawData.IsShareToFacebook
            data.Blurbs[j].IsShareToTwitter = RawData.IsShareToTwitter
            data.Blurbs[j].IsShareToLinkedIn = RawData.IsShareToLinkedIn
            data.Blurbs[j].PerformingAction = false;
            data.Blurbs[j].showRejectOption = false;

            var CurrentTeamBlurbs = TeamBlurbs.filter(function (teamBlurb) {
                return teamBlurb.BlurbId == data.Blurbs[j].BlurbId
            })
            for (var k = 0; k < teams.length; k++) {

                CurrentTeamBlurbs.filter(function (currentTeamBlurb) {
                    if (currentTeamBlurb.TeamId == teams[0].TeamId)
                        teams[0].Selected = true;
                })

            }
            data.Blurbs[j].Teams = teams;
            // Blurbs.push(ko.mapping.fromJS(data.Blurbs[j]));
            //  model.isAllSelected(false);
            self.postMessage({ 'obj': data.Blurbs[j], 'initialBlurb': true });
            j = j + 1;
        },500);
   
    }
}
