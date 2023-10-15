const St = imports.gi.St;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;

let panelButton, panelButtonText, timeout;

function setButtonText () {
    const currentDate = new Date();
    const yesterdayDate = new Date(currentDate);
    const tomorrowDate = new Date(currentDate);
    const dayAfterDate = new Date(currentDate);

    yesterdayDate.setDate(currentDate.getDate() - 1);
    tomorrowDate.setDate(currentDate.getDate() + 1);
    dayAfterDate.setDate(currentDate.getDate() + 2);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const today = String(currentDate.getDate()).padStart(2, '0');
    const yesterday = String(yesterdayDate.getDate()).padStart(2, '0');
    const tomorrow = String(tomorrowDate.getDate()).padStart(2, '0');
    const dayAfter = String(dayAfterDate.getDate()).padStart(2, '0');
    
    const todayFormatted = `${year}-${month}-${today}:`;
    const yesterdayFormatted = `${year}-${month}-${yesterday}:`;
    const tomorrowFormatted = `${year}-${month}-${tomorrow}:`;
    const dayAfterFormatted = `${year}-${month}-${dayAfter}:`;

    // calendar
    var [ok, out, err, exit] = GLib.spawn_command_line_sync('cat today.txt');
    let calendarRaw = out.toString();

    let calendar_no_full_date = "";
    let calendar_no_last_new_line = calendarRaw.substring(0, calendarRaw.lastIndexOf("\n")); 

    calendar_no_full_date = calendar_no_last_new_line
    .replaceAll(todayFormatted, "")
    .replaceAll(yesterdayFormatted, "Yesterday: ")
    .replaceAll(tomorrowFormatted, "Tomorrow: ")
    .replaceAll(dayAfterFormatted, "Day After: ")
    .replaceAll("\t", "  ");

    panelButtonText.set_text(calendar_no_full_date);

    return true;
}

function init() {
    panelButton = new St.Bin({
        style_class: "style-panel-button"
    });
    
    panelButtonText = new St.Label({
        style_class: "style-panel-text"
    });
    
    panelButton.set_child(panelButtonText);
}

function enable() {
    setButtonText();
    Main.panel._rightBox.insert_child_at_index(panelButton, 0);
    timeout = Mainloop.timeout_add_seconds(5.0, setButtonText);   
}

function disable() {    
    Mainloop.source_remove(timeout);
    Main.panel._rightBox.remove_child(panelButton);
}