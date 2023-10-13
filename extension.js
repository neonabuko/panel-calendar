const St = imports.gi.St;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;

let panelButton, panelButtonText, timeout;

function setButtonText () {
    const currentDate = new Date();
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const yesterday = String(yesterdayDate.getDate()).padStart(2, '0');
    
    const todayFormatted = `${year}-${month}-${day}:`;
    const yesterdayFormatted = `${year}-${month}-${yesterday}:`;

    // calendar
    var [ok, out, err, exit] = GLib.spawn_command_line_sync('cat today.txt');
    let calendarRaw = out.toString();

    let calendar_no_full_date = "";
    if (calendarRaw.includes(todayFormatted)) {
        let calendar_no_last_new_line = calendarRaw.substring(0, calendarRaw.lastIndexOf("\n")); 
        calendar_no_full_date = calendar_no_last_new_line.replaceAll(todayFormatted, "").replaceAll("\t", "  ");
    }

    if (calendarRaw.includes(yesterdayFormatted)) {
        calendar_no_full_date = calendar_no_full_date.replaceAll(yesterdayFormatted);
    }

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