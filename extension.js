const St = imports.gi.St;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;

let panelButton, panelButtonText;

function setButtonText () {
    // date
    var [ok, out, err, exit] = GLib.spawn_command_line_sync('date "+%Y-%m-%d:"');
    let today = out.toString().replaceAll("\n", "");

    // calendar
    var [ok, out, err, exit] = GLib.spawn_command_line_sync('cat today.txt');
    let calendar = out.toString().replaceAll(today, "").replaceAll("\t", "  ");
    let index_of_last_new_line = calendar.lastIndexOf("\n");
    let calendar_no_last_new_line = calendar.substring(0, index_of_last_new_line); 

    panelButtonText.set_text(calendar_no_last_new_line);

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
}

function disable() {    
    Main.panel._rightBox.remove_child(panelButton);
}