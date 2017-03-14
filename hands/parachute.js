var lineCounter = 1;
var funcBlock = {
line1: function (){
	showText("I'm getting up to leave when my new therapist asks me what my \"official\" gender is")
},
line2: function (){
	showText("(for insurance purposes, of course)")
},

line3: function (){
	showText("and I nod and tell him what he already knows.")
},

line4: function (){
	showText("I don't mention how my gender feels more like psychosis than performance,")
},

line5: function (){
	showText("prophetic imaginations of alternate planes.")
},
line6: function (){
	showText("That it makes it easier to breathe when I can tell myself")
},
line7: function (){
	showText("that this body, too, is transient and mutable.")
},

line8: function (){
	showText("I leave that for next session.")
},

line9: function (){
	showText("<br>\"You're really hard on yourself, huh?\"")
},

line10: function (){
	showText("A question from across a desk above which hang")
},
line11: function (){
	showText("gold lettered degrees and psychoanalytic training certificates.")
},
line12: function (){
	showText("This is the revelation from hours of digging")
},

line13: function (){
	showText("through trauma, medical histories, childhood memories,")
},

line14: function (){
	showText("ruminations, suicidal ideations, accounts of self harm.")
},

line15: function (){
	showText("I should become kinder, it seems.")
},
line16: function (){
	showText("<br>I am prescribed mindfulness like medication,")
},
line17: function (){
	showText("given my dialectical worksheets and meditation guides.")
},

line18: function (){
	showText("or of Kannon's infinite compassion,")
},

line19: function (){
	showText("of the diamond or of the womb.")
},

line20: function (){
	showText("If I am diligent in my secular studies, I wonder,")
},
line21: function (){
	showText("will I receive ten thousand hands?")
},
line22: function (){
	showText("<br>That night I rewrite the poems written for my ex boyfriend,")
},

line23: function (){
	showText("combine them with my medication info sheets,")
},

line24: function (){
	showText("because aestheticizing my pain seems like an artsy thing to do")
},

line25: function (){
	showText("and I've run out of ways to tell him he's hurt me.")
},
line26: function (){
	showText("<br>I write a new sutra professing my love.")
},
line27: function (){
	showText("I keep the wound agape.")
}
}


Mousetrap.bind("space", function(){
	playLinear();
});

function showText(text) {
	//if($('#bgvid')[0].currentTime > 53){
		$('#textHerePlz').append("<h1 class='line' id='line"+lineCounter.toString()+"'>"+text+"</h1>")
		$('#line' + (lineCounter-2).toString()).flyOut(14000);
		lineCounter++;
		$('#bottom')[0].scrollIntoView(false);
	//}
}
function playLinear() {
	if($('#bgvid')[0].currentTime == 0){
		$('#bgvid')[0].play();
		$('#introText').fadeOut(2000)
	} else{
		funcBlock["line"+lineCounter.toString()]()
	}
}
$(document).ready(function(){
    $(document).click(playLinear);
   });

$.fn.flyOut = function(t){
	this.animate({'top':'-300px', 'margin-left': '10%', opacity: 0, 'font-size': '10px'},t, function(){})
}
